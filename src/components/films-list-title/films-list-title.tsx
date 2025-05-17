import { JSX } from 'react';

type FIlmsListTitleProps = {
  text: string;
  isVisible: boolean;
};

export default function FilmsListTitle({
  text = 'All movies. Upcoming',
  isVisible = false,
}: FIlmsListTitleProps): JSX.Element {
  return (
    <div>
      <h2 className={`films-list__title ${isVisible ? '' : 'visually-hidden'}`}>
        {text}
      </h2>
    </div>
  );
}
