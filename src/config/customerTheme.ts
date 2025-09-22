// 顾客端专用主题配置
export const customerTheme = {
  token: {
    // 顾客端主色调 - 优雅金色系
    colorPrimary: '#D4AF37',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#1a1a1a',
      siderBg: '#f8f9fa',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#fff8e1',
      itemHoverBg: '#fffbf0',
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
    },
    Button: {
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 12,
      fontSize: 16,
    },
    Table: {
      borderRadius: 12,
    },
    // 顾客端专用组件样式
    Typography: {
      fontSize: 16,
      lineHeight: 1.6,
    },
    Space: {
      size: 16,
    },
  },
}

// 顾客端颜色配置
export const customerColors = {
  primary: '#D4AF37',
  primaryHover: '#B8941F',
  primaryLight: '#F5E6A3',
  secondary: '#8B4513',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e8e8e8',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
}

// 顾客端专用CSS类名
export const customerClasses = {
  container: 'customer-container',
  card: 'customer-card',
  button: 'customer-button',
  input: 'customer-input',
  navigation: 'customer-navigation',
  mobileNav: 'customer-mobile-nav',
  hero: 'customer-hero',
  feature: 'customer-feature',
}
