declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        fullName: string;
        email: string;
        password: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    };

    type CountrySelectProps = {
        name: string;
        label: string;
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    };

    type Option = {
        value: string;
        label: string;
    };

    type SelectFieldProps = {
        name: string;
        label: string;
        placeholder: string;
        options: readonly Option[];
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    };

    type SearchCommandProps = {
        renderAs?: 'button' | 'text';
        label?: string;
        initialStocks: StockWithWatchlistStatus[];
    };

    type WelcomeEmailData = {
        email: string;
        name: string;
        intro: string;
    };

    type User = {
        id: string;
        name: string;
        email?: string; // Optional - not passed to client components for privacy
    };

    type Stock = {
        symbol: string;
        name: string;
        exchange: string;
        type: string;
    };

    type StockWithWatchlistStatus = Stock & {
        isInWatchlist: boolean;
    };

    type FinnhubSearchResult = {
        symbol: string;
        description: string;
        displaySymbol?: string;
        type: string;
    };

    type FinnhubSearchResponse = {
        count: number;
        result: FinnhubSearchResult[];
    };

    type StockDetailsPageProps = {
        params: Promise<{
            symbol: string;
        }>;
    };

    type WatchlistButtonProps = {
        symbol: string;
        company: string;
        isInWatchlist: boolean;
        showTrashIcon?: boolean;
        type?: 'button' | 'icon';
        onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
        userId?: string;
    };

    type QuoteData = {
        c?: number;
        dp?: number;
    };

    type ProfileData = {
        name?: string;
        marketCapitalization?: number;
    };

    type FinancialsData = {
        metric?: { [key: string]: number };
    };

    type SelectedStock = {
        symbol: string;
        company: string;
        currentPrice?: number;
    };

    type WatchlistTableProps = {
        watchlist: StockWithData[];
    };

    type StockWithData = {
        userId: string;
        symbol: string;
        company: string;
        addedAt: string;
        currentPrice: number;
        change: number;
        changePercent: number;
        marketCap: number;
        pe: number;
    };

    type AlertsListProps = {
        alertData: Alert[] | undefined;
    };

    // Trading System Types
    type PortfolioHolding = {
        symbol: string;
        type: 'STOCK' | 'CRYPTO';
        quantity: number;
        avgPrice: number;
        currentPrice: number;
        totalInvested: number;
        currentValue: number;
        pnl: number;
        pnlPercentage: number;
        lastUpdated: string;
    };

    type TradeTransaction = {
        id: string;
        symbol: string;
        type: 'STOCK' | 'CRYPTO';
        action: 'BUY' | 'SELL';
        quantity: number;
        price: number;
        total: number;
        fee: number;
        timestamp: string;
        txHash?: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
    };

    type TradingInterfaceProps = {
        symbol: string;
        currentPrice: number;
        userId: string;
        type: 'STOCK' | 'CRYPTO';
    };

    type CorrelatedCrypto = {
        symbol: string;
        name: string;
        price: number;
        change24h: number;
        marketCap: number;
        sector: string;
    };

    type SectorCorrelationProps = {
        stockSymbol: string;
        stockSector: string;
    };

    type MarketNewsArticle = {
        id: number;
        headline: string;
        summary: string;
        source: string;
        url: string;
        datetime: number;
        category: string;
        related: string;
        image?: string;
    };

    type WatchlistNewsProps = {
        news?: MarketNewsArticle[];
    };

    type SearchCommandProps = {
        open?: boolean;
        setOpen?: (open: boolean) => void;
        renderAs?: 'button' | 'text';
        buttonLabel?: string;
        buttonVariant?: 'primary' | 'secondary';
        className?: string;
    };

    type AlertData = {
        symbol: string;
        company: string;
        alertName: string;
        alertType: 'upper' | 'lower';
        threshold: string;
    };

    type AlertModalProps = {
        alertId?: string;
        alertData?: AlertData;
        action?: string;
        open: boolean;
        setOpen: (open: boolean) => void;
    };

    type RawNewsArticle = {
        id: number;
        headline?: string;
        summary?: string;
        source?: string;
        url?: string;
        datetime?: number;
        image?: string;
        category?: string;
        related?: string;
    };

    type Alert = {
        id: string;
        symbol: string;
        company: string;
        alertName: string;
        currentPrice: number;
        alertType: 'upper' | 'lower';
        threshold: number;
        changePercent?: number;
    };

    // AI Consultation Types
    type AIAdvisorPersonality = 'conservative' | 'aggressive' | 'balanced' | 'analytical';
    
    type AIAdvisor = {
        _id: string;
        name: string;
        userId: string;
        instructions: string;
        personality: AIAdvisorPersonality;
        avatar: string;
        createdAt: string;
        updatedAt: string;
    };

    type ConsultationStatus = 'upcoming' | 'active' | 'completed' | 'processing' | 'cancelled';

    type Consultation = {
        _id: string;
        name: string;
        userId: string;
        advisorId: string;
        advisor?: AIAdvisor;
        status: ConsultationStatus;
        startedAt?: string;
        endedAt?: string;
        transcriptUrl?: string;
        recordingUrl?: string;
        summary?: string;
        duration?: number;
        createdAt: string;
        updatedAt: string;
    };

    type TranscriptItem = {
        speaker_id: string;
        start_time: number;
        end_time: number;
        text: string;
        user?: {
            name: string;
            image?: string;
        };
    };

    type ConsultationFormData = {
        name: string;
        advisorId: string;
    };
}

export {};
