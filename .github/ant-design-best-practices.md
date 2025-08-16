# Ant Design Best Practices - Gamma Vite App

## Component Usage Guidelines

### 1. Spin Component Best Practices

```tsx
// ❌ BAD - tip only works in nest pattern
<Spin size="large" tip="Loading..." />

// ✅ GOOD - nest pattern with tip
<Spin size="large" tip="Loading...">
  <div style={{ minHeight: '200px' }} />
</Spin>

// ✅ GOOD - standalone without tip
<Spin size="large" />

// ✅ GOOD - custom loading wrapper
<div style={{ textAlign: 'center', padding: '20px' }}>
  <Spin size="large" />
  <div style={{ marginTop: '8px' }}>Loading...</div>
</div>
```

### 2. Message API Best Practices

```tsx
// ❌ BAD - Static function doesn't consume context
import { message } from 'antd';
message.success('Success!');

// ✅ GOOD - Use App component for context
import { App } from 'antd';

const MyComponent = () => {
  const { message } = App.useApp();
  
  const handleSuccess = () => {
    message.success('Success!');
  };
  
  return <button onClick={handleSuccess}>Click me</button>;
};

// ✅ GOOD - Wrap app with App component
<App>
  <MyComponent />
</App>

// ✅ GOOD - For components that need message API
export const ComponentWithMessages: React.FC = () => {
  const { message } = App.useApp();

  const handleTestConnection = async () => {
    try {
      await testConnection();
      message.success('Connection successful');
    } catch (error) {
      message.error('Connection failed');
    }
  };

  return (
    <Button onClick={handleTestConnection}>
      Test Connection
    </Button>
  );
};
```

### 3. Theme Integration

```tsx
// ✅ GOOD - Use CSS variables for consistent theming
const StyledComponent = styled.div`
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
`;

// ✅ GOOD - Ant Design components automatically use theme
<Card 
  styles={{
    body: {
      backgroundColor: 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)'
    }
  }}
>
  Content
</Card>
```

### 4. Layout Components

```tsx
// ✅ GOOD - Proper Layout structure
<Layout>
  <Header style={{ background: 'var(--color-bg-primary)' }}>
    Header Content
  </Header>
  <Content style={{ 
    background: 'var(--color-bg-secondary)',
    minHeight: 'calc(100vh - 64px)'
  }}>
    Main Content
  </Content>
</Layout>
```

### 5. List Components with Theme Support

```tsx
// ✅ GOOD - List with proper theme integration
<List
  dataSource={items}
  renderItem={(item) => (
    <List.Item
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border)',
        marginBottom: '8px'
      }}
      actions={[
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(item.id)}
        />
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={item.avatar} />}
        title={<span style={{ color: 'var(--color-text-primary)' }}>{item.title}</span>}
        description={<span style={{ color: 'var(--color-text-secondary)' }}>{item.description}</span>}
      />
    </List.Item>
  )}
/>
```

### 6. Form Components

```tsx
// ✅ GOOD - Form with proper styling
<Form
  layout="vertical"
  style={{
    backgroundColor: 'var(--color-bg-primary)',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)'
  }}
>
  <Form.Item 
    label={<span style={{ color: 'var(--color-text-primary)' }}>Label</span>}
    name="field"
  >
    <Input placeholder="Enter value" />
  </Form.Item>
</Form>
```

### 7. Modal and Drawer

```tsx
// ✅ GOOD - Modal with theme support
<Modal
  title={<span style={{ color: 'var(--color-text-primary)' }}>Title</span>}
  open={visible}
  styles={{
    content: {
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border)'
    }
  }}
>
  Content
</Modal>
```

## Common Anti-Patterns to Avoid

### ❌ Static API Usage Without Context
```tsx
// DON'T - Will show theme warning
import { message, notification } from 'antd';
message.error('Error');
notification.open({ message: 'Info' });
```

### ❌ Hardcoded Colors
```tsx
// DON'T - Breaks theme consistency
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  Content
</div>
```

### ❌ Improper Spin Usage
```tsx
// DON'T - Shows tip warning
<Spin tip="Loading..." />
```

### ❌ Missing Theme Variables
```tsx
// DON'T - Won't adapt to theme changes
<Card style={{ backgroundColor: 'white' }}>
  Content
</Card>
```

## Best Practices Checklist

- [ ] Use `App.useApp()` for message, notification, modal APIs
- [ ] Wrap root component with Ant Design `App` component
- [ ] Use CSS custom properties for colors and spacing
- [ ] Test components in both light and dark themes
- [ ] Use `styles` prop instead of deprecated `*Style` props
- [ ] Implement proper loading states with nested Spin components
- [ ] Ensure all interactive elements have proper focus states
- [ ] Use semantic HTML where possible (List.Item, Form.Item, etc.)

## Performance Considerations

- Import only needed icons: `import { DeleteOutlined } from '@ant-design/icons'`
- Use `React.memo` for expensive list items
- Implement virtualization for large datasets
- Use `loading` prop on buttons during async operations
- Lazy load heavy components (DatePicker, Table with many columns)

## Accessibility

- Always provide `aria-label` for icon-only buttons
- Use proper heading hierarchy in Cards and Modals
- Ensure sufficient color contrast in custom styles
- Test keyboard navigation flow
- Provide `alt` text for Avatar images
