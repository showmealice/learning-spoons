// 환경변수 설정 파일
// 실제 프로덕션에서는 .env 파일을 사용하세요

const ENV_CONFIG = {
    // Supabase 프로젝트 설정
    SUPABASE_URL: 'https://rwoezhowdclulgehwffm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3b2V6aG93ZGNsdWxnZWh3ZmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjgzMDcsImV4cCI6MjA3MTQwNDMwN30.YaDAfCwGDs6viv2t2V3oDTblz1MqFFfj4sEPcIuc1PA',
    
    // 앱 설정
    APP_NAME: '소셜피드',
    APP_VERSION: '1.0.0',
    APP_ENV: 'development',
    
    // 데이터베이스 설정
    DB_HOST: 'rwoezhowdclulgehwffm.supabase.co',
    DB_PORT: 5432,
    DB_NAME: 'postgres',
    
    // 인증 설정
    AUTH_ENABLE_ANONYMOUS: true,
    AUTH_ENABLE_EMAIL: false,
    AUTH_ENABLE_PHONE: false,
    
    // API 설정
    API_TIMEOUT: 30000,
    API_RETRY_ATTEMPTS: 3,
    
    // 이미지 설정
    IMAGE_MAX_SIZE: 5242880, // 5MB
    IMAGE_ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    UNSPLASH_API_URL: 'https://images.unsplash.com',
    
    // 개발 환경 설정
    DEBUG_MODE: true,
    LOG_LEVEL: 'info',
    
    // 기능 플래그
    FEATURES: {
        REAL_TIME: true,
        FILE_UPLOAD: false,
        PUSH_NOTIFICATIONS: false,
        ANALYTICS: false
    }
};

// 환경별 설정
const ENV_SPECIFIC_CONFIG = {
    development: {
        DEBUG_MODE: true,
        LOG_LEVEL: 'debug',
        API_TIMEOUT: 60000
    },
    staging: {
        DEBUG_MODE: true,
        LOG_LEVEL: 'info',
        API_TIMEOUT: 30000
    },
    production: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'warn',
        API_TIMEOUT: 15000,
        FEATURES: {
            ...ENV_CONFIG.FEATURES,
            REAL_TIME: true,
            FILE_UPLOAD: true,
            PUSH_NOTIFICATIONS: true,
            ANALYTICS: true
        }
    }
};

// 현재 환경 감지
const getCurrentEnv = () => {
    if (typeof window !== 'undefined') {
        // 브라우저 환경
        return window.location.hostname === 'localhost' ? 'development' : 'production';
    }
    // Node.js 환경
    return process.env.NODE_ENV || 'development';
};

// 환경별 설정 병합
const getConfig = () => {
    const currentEnv = getCurrentEnv();
    return {
        ...ENV_CONFIG,
        ...ENV_SPECIFIC_CONFIG[currentEnv],
        CURRENT_ENV: currentEnv
    };
};

// 환경변수 유효성 검사
const validateConfig = (config) => {
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.error('❌ 필수 환경변수가 누락되었습니다:', missing);
        return false;
    }
    
    console.log('✅ 환경변수 설정이 완료되었습니다.');
    console.log('🌍 현재 환경:', config.CURRENT_ENV);
    console.log('🔗 Supabase URL:', config.SUPABASE_URL);
    return true;
};

// 설정 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ENV_CONFIG, getConfig, validateConfig };
} else if (typeof window !== 'undefined') {
    window.ENV_CONFIG = ENV_CONFIG;
    window.getConfig = getConfig;
    window.validateConfig = validateConfig;
}

// 자동 검증 실행
if (typeof window !== 'undefined') {
    const config = getConfig();
    validateConfig(config);
}
