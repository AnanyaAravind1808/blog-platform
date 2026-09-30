export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-spinner-wrapper" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <p>{label}</p>
    </div>
  );
}
