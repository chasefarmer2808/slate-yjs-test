import { useYjs } from './plugins/useYjs';
import { YjsEditor } from './YjsEditor';

export const YjsWrapper: React.FC = () => {
  const [sharedType, provider, isSynced] = useYjs('1234', [
    { type: 'paragraph', children: [{ text: 'hello' }] }
  ]);

  if (!isSynced) {
    return <p>Loading...</p>;
  }

  return <YjsEditor sharedType={sharedType} provider={provider} />;
};
