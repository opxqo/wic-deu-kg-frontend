import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService, SysConfigVO } from '../services/configService';

interface ConfigContextType {
    config: SysConfigVO;
    refreshConfig: () => Promise<void>;
    loading: boolean;
}

const defaultConfig: SysConfigVO = {
    maintenanceMode: false,
    openRegistration: true,
};

const ConfigContext = createContext<ConfigContextType>({
    config: defaultConfig,
    refreshConfig: async () => { },
    loading: false,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SysConfigVO>(defaultConfig);
    const [loading, setLoading] = useState(true);

    const refreshConfig = async () => {
        try {
            const result = await configService.getSystemConfig();
            if (result.code === 0 && result.data) {
                setConfig(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch system config", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, refreshConfig, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
