import { JSX } from 'react';

type ShowMoreButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ShowMoreButton({
  onClick,
}: ShowMoreButtonProps): JSX.Element {
  return (
    <button className='films-list__show-more' onClick={onClick}>
      Show more
    </button>
  );
}
