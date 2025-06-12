const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

import { useAppDispatch } from '.';

describe('useAppDispatch', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should return the dispatch function', () => {
    const dispatchFromHook = useAppDispatch();
    expect(dispatchFromHook).toBe(mockDispatch);
  });

  it('should call dispatch when used conceptually in a component', () => {
    const simulateComponentRender = () => {
      const dispatch = useAppDispatch();
      dispatch({ type: 'TEST_ACTION' });
    };

    simulateComponentRender();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TEST_ACTION' });
  });

  it('should dispatch multiple actions', () => {
    const simulateMultiActionComponent = () => {
      const dispatch = useAppDispatch();
      dispatch({ type: 'FIRST_ACTION' });
      dispatch({ type: 'SECOND_ACTION' });
    };

    simulateMultiActionComponent();

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FIRST_ACTION' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SECOND_ACTION' });
  });
});
