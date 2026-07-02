import './Loader.css';

interface LoaderProps {
  text?: string;
}

export function Loader({ text }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner" />
      {text && <span className="loader__text">{text}</span>}
    </div>
  );
}
