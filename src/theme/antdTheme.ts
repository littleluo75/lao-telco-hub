import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors - Deep Navy Blue
    colorPrimary: '#1e3a5f',
    colorLink: '#2563eb',
    colorSuccess: '#16a34a',
    colorWarning: '#f59e0b',
    colorError: '#dc2626',
    colorInfo: '#0ea5e9',
    
    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // Text colors
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      siderBg: '#1e3a5f',
      bodyBg: '#f8fafc',
    },
    Menu: {
      darkItemBg: '#1e3a5f',
      darkItemSelectedBg: '#2d4a6f',
      darkItemHoverBg: '#2d4a6f',
      darkItemColor: 'rgba(255, 255, 255, 0.85)',
      darkItemSelectedColor: '#ffffff',
      itemMarginInline: 8,
      itemPaddingInline: 16,
      itemHeight: 40,
      iconSize: 18,
    },
    Button: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      paddingContentHorizontal: 20,
    },
    Input: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    Select: {
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      rowHoverBg: '#f1f5f9',
      borderColor: '#e2e8f0',
    },
    Card: {
      paddingLG: 24,
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 28,
    },
    Tag: {
      defaultBg: '#f1f5f9',
      defaultColor: '#475569',
    },
    Badge: {
      statusSize: 8,
    },
  },
};
