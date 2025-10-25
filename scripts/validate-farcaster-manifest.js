#!/usr/bin/env node

/**
 * Farcaster Manifest Validator
 *
 * Validates the farcaster.json manifest file for completeness and correctness.
 * Run with: node scripts/validate-farcaster-manifest.js
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../public/.well-known/farcaster.json');
const REQUIRED_FIELDS = {
  accountAssociation: ['header', 'payload', 'signature'],
  baseBuilder: ['ownerAddress'],
  miniapp: [
    'version',
    'name',
    'homeUrl',
    'iconUrl',
    'splashImageUrl',
    'splashBackgroundColor',
    'primaryCategory',
    'tags'
  ]
};

const OPTIONAL_FIELDS = {
  miniapp: [
    'subtitle',
    'description',
    'screenshotUrls',
    'heroImageUrl',
    'tagline',
    'ogTitle',
    'ogDescription',
    'ogImageUrl',
    'webhookUrl',
    'noindex'
  ]
};

function validateManifest() {
  console.log('🔍 Validating Farcaster manifest...\n');

  // Check file exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Manifest file not found at:', MANIFEST_PATH);
    process.exit(1);
  }

  // Read and parse JSON
  let manifest;
  try {
    const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to parse manifest JSON:', error.message);
    process.exit(1);
  }

  let errors = [];
  let warnings = [];

  // Validate required fields
  Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
    if (!manifest[section]) {
      errors.push(`Missing required section: ${section}`);
      return;
    }

    fields.forEach(field => {
      const value = manifest[section][field];
      if (value === undefined || value === null || value === '') {
        errors.push(`Missing required field: ${section}.${field}`);
      }
    });
  });

  // Check account association is populated
  if (manifest.accountAssociation) {
    const { header, payload, signature } = manifest.accountAssociation;
    if (!header || !payload || !signature) {
      warnings.push('accountAssociation fields are empty - you need to generate them using Base Build tool');
    }
  }

  // Validate URLs
  const urlFields = [
    'miniapp.homeUrl',
    'miniapp.iconUrl',
    'miniapp.splashImageUrl',
    'miniapp.heroImageUrl',
    'miniapp.ogImageUrl',
    'miniapp.webhookUrl'
  ];

  urlFields.forEach(fieldPath => {
    const [section, field] = fieldPath.split('.');
    const value = manifest[section]?.[field];
    if (value && !value.startsWith('https://')) {
      errors.push(`${fieldPath} must be HTTPS URL`);
    }
  });

  // Validate ownerAddress format
  if (manifest.baseBuilder?.ownerAddress) {
    const address = manifest.baseBuilder.ownerAddress;
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      errors.push('baseBuilder.ownerAddress must be a valid Ethereum address');
    }
  }

  // Validate version
  if (manifest.miniapp?.version !== '1') {
    errors.push('miniapp.version must be "1"');
  }

  // Validate primaryCategory
  const validCategories = [
    'games', 'social', 'finance', 'utility', 'productivity',
    'health-fitness', 'news-media', 'music', 'shopping',
    'education', 'developer-tools', 'entertainment', 'art-creativity'
  ];
  if (manifest.miniapp?.primaryCategory && !validCategories.includes(manifest.miniapp.primaryCategory)) {
    errors.push(`primaryCategory must be one of: ${validCategories.join(', ')}`);
  }

  // Validate tags
  if (manifest.miniapp?.tags) {
    if (!Array.isArray(manifest.miniapp.tags)) {
      errors.push('tags must be an array');
    } else {
      if (manifest.miniapp.tags.length > 5) {
        warnings.push('More than 5 tags - only first 5 will be used');
      }
      manifest.miniapp.tags.forEach(tag => {
        if (tag.length > 20) {
          errors.push(`Tag "${tag}" exceeds 20 characters`);
        }
        if (!/^[a-z0-9-]+$/.test(tag)) {
          errors.push(`Tag "${tag}" contains invalid characters (use lowercase, numbers, hyphens only)`);
        }
      });
    }
  }

  // Validate string lengths
  const lengthLimits = {
    'miniapp.name': 32,
    'miniapp.subtitle': 30,
    'miniapp.description': 170,
    'miniapp.tagline': 30,
    'miniapp.ogTitle': 30,
    'miniapp.ogDescription': 100,
    'miniapp.homeUrl': 1024,
    'miniapp.webhookUrl': 1024
  };

  Object.entries(lengthLimits).forEach(([fieldPath, maxLength]) => {
    const [section, field] = fieldPath.split('.');
    const value = manifest[section]?.[field];
    if (value && value.length > maxLength) {
      errors.push(`${fieldPath} exceeds ${maxLength} characters (current: ${value.length})`);
    }
  });

  // Validate splash background color
  if (manifest.miniapp?.splashBackgroundColor) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(manifest.miniapp.splashBackgroundColor)) {
      errors.push('splashBackgroundColor must be a valid hex color (e.g., #000000)');
    }
  }

  // Validate screenshots
  if (manifest.miniapp?.screenshotUrls) {
    if (!Array.isArray(manifest.miniapp.screenshotUrls)) {
      errors.push('screenshotUrls must be an array');
    } else if (manifest.miniapp.screenshotUrls.length > 3) {
      warnings.push('More than 3 screenshots - only first 3 will be displayed');
    }
  }

  // Print results
  console.log('📋 Validation Results:\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Manifest is valid!');
    console.log('\n📝 Next steps:');
    console.log('  1. Deploy your app to make the manifest accessible');
    console.log('  2. Generate account association: https://base.dev/preview?tab=account');
    console.log('  3. Test with Preview Tool: https://base.dev/preview');
    return;
  }

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach(error => console.log(`  • ${error}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach(warning => console.log(`  • ${warning}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ Validation failed. Please fix the errors above.');
    process.exit(1);
  }

  console.log('⚠️  Validation passed with warnings. Review warnings before deploying.');
}

// Run validation
validateManifest();
