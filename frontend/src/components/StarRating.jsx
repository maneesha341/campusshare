// Reusable star rating. `value` controls filled stars.
// Pass `onChange` to make it interactive (click to set rating); omit it for a read-only display.
const StarRating = ({ value = 0, onChange, size = 'text-lg' }) => {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <div className={`inline-flex gap-0.5 ${size}`}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={interactive ? () => onChange(s) : undefined}
          className={`${interactive ? 'cursor-pointer' : ''} ${s <= Math.round(value) ? 'text-sunshine-500' : 'text-ink/15'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;