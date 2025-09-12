// Supabase 설정 - 환경변수 기반
// env.config.js에서 설정을 가져옵니다

// 환경변수 설정 로드
let SUPABASE_CONFIG = null;

// 환경변수 설정 파일이 로드되었는지 확인
const loadSupabaseConfig = () => {
    if (typeof window !== 'undefined' && window.getConfig) {
        return window.getConfig();
    }
    
    // fallback 설정 (개발용)
    return {
        SUPABASE_URL: 'https://rwoezhowdclulgehwffm.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3b2V6aG93ZGNsdWxnZWh3ZmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjgzMDcsImV4cCI6MjA3MTQwNDMwN30.YaDAfCwGDs6viv2t2V3oDTblz1MqFFfj4sEPcIuc1PA',
        CURRENT_ENV: 'development'
    };
};

// Supabase 클라이언트 초기화
const initSupabaseClient = () => {
    try {
        const config = loadSupabaseConfig();
        SUPABASE_CONFIG = config;
        
        if (typeof window !== 'undefined' && window.supabase) {
            const supabase = window.supabase.createClient(
                config.SUPABASE_URL,
                config.SUPABASE_ANON_KEY
            );
            
            console.log('✅ Supabase 클라이언트가 환경변수로 초기화되었습니다.');
            console.log('🌍 환경:', config.CURRENT_ENV);
            console.log('🔗 URL:', config.SUPABASE_URL);
            
            return supabase;
        } else {
            console.error('❌ Supabase 라이브러리를 불러올 수 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('❌ Supabase 초기화 중 오류 발생:', error);
        return null;
    }
};

// Supabase 클라이언트 인스턴스
let supabaseClient = null;

// 클라이언트 가져오기
const getSupabaseClient = () => {
    if (!supabaseClient) {
        supabaseClient = initSupabaseClient();
    }
    return supabaseClient;
};

// Supabase 설정 가져오기
const getSupabaseConfig = () => {
    if (!SUPABASE_CONFIG) {
        SUPABASE_CONFIG = loadSupabaseConfig();
    }
    return SUPABASE_CONFIG;
};

// 연결 테스트
const testSupabaseConnection = async () => {
    try {
        const client = getSupabaseClient();
        if (!client) return false;
        
        const { data, error } = await client
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log('⚠️ Supabase 연결 테스트:', error.message);
            return false;
        }
        
        console.log('✅ Supabase 연결이 정상적으로 작동합니다.');
        return true;
    } catch (error) {
        console.log('⚠️ 연결 테스트 중 오류:', error.message);
        return false;
    }
};

// 환경변수 유효성 검사
const validateSupabaseEnvironment = () => {
    const config = getSupabaseConfig();
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.error('❌ 필수 환경변수가 누락되었습니다:', missing);
        return false;
    }
    
    return true;
};

// 자동 초기화
if (typeof window !== 'undefined') {
    // DOM이 로드된 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            validateSupabaseEnvironment();
            testSupabaseConnection();
        });
    } else {
        validateSupabaseEnvironment();
        testSupabaseConnection();
    }
}

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG: getSupabaseConfig(),
        supabase: getSupabaseClient(),
        getSupabaseConfig,
        getSupabaseClient,
        testSupabaseConnection,
        validateSupabaseEnvironment
    };
} else if (typeof window !== 'undefined') {
    // 전역 객체로 노출 (다른 이름 사용)
    window.SupabaseClientConfig = {
        SUPABASE_CONFIG: getSupabaseConfig(),
        supabase: getSupabaseClient(),
        getSupabaseConfig,
        getSupabaseClient,
        testSupabaseConnection,
        validateSupabaseEnvironment
    };
}
