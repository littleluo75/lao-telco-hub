import { Typography } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
}

export default function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <div
      style={{
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          {title}
        </Title>
        {description && (
          <Text type="secondary">{description}</Text>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
}
