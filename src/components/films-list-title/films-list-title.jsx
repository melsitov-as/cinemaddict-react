export default function FilmsListTitle({
  text = 'All movies. Upcoming',
  isVisible = false,
}) {
  return (
    <div>
      <h2 className={`films-list__title ${isVisible ? '' : 'visually-hidden'}`}>
        {text}
      </h2>
    </div>
  );
}
