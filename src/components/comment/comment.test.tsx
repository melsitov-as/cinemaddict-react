import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Comment, { CommentType } from './comment';
import * as reactRedux from 'react-redux';
import { deleteComment } from '../../store/action';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('Comment component', () => {
  const mockComment: CommentType = {
    id: '123',
    emoji: 'smile',
    text: 'Hello &amp; World!',
    author: 'John Doe',
    date: '2023-10-26T14:30:00.000Z',
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render comment details correctly', () => {
    render(<Comment comment={mockComment} onDelete={mockOnDelete} />);

    const commentElement = screen.getByTestId('comment');
    expect(commentElement).toBeInTheDocument();

    expect(screen.getByText('Hello & World!')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2023-10-26T14:30:00.000Z')).toBeInTheDocument();

    const emojiImage = screen.getByAltText(`emoji-${mockComment.emoji}`);
    expect(emojiImage).toBeInTheDocument();
    expect(emojiImage).toHaveAttribute(
      'src',
      `/cinemaaddict-react/images/emoji/${mockComment.emoji}.png`
    );
    expect(emojiImage).toHaveAttribute('width', '55');
    expect(emojiImage).toHaveAttribute('height', '55');

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should dispatch deleteComment action when delete button is clicked', () => {
    render(<Comment comment={mockComment} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      deleteComment({ id: mockComment.id })
    );

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should render with different comment data', () => {
    const anotherComment: CommentType = {
      id: '456',
      emoji: 'star',
      text: 'Great movie!',
      author: 'Jane Doe',
      date: '2024-01-15T09:00:00.000Z',
    };

    render(<Comment comment={anotherComment} onDelete={mockOnDelete} />);

    expect(screen.getByText('Great movie!')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByAltText('emoji-star')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
