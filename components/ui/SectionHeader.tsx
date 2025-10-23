interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: 'yellow' | 'purple' | 'blue' | 'green';
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  gradient = 'yellow',
  className = '' 
}: SectionHeaderProps) {
  const words = title.split(' ');
  const lastWord = words[words.length - 1];
  const otherWords = words.slice(0, -1).join(' ');

  const gradientColors = {
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
  };

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-2 text-center">
        {otherWords && `${otherWords} `}
        <span className={gradientColors[gradient]}>{lastWord}</span>
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 text-center max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

