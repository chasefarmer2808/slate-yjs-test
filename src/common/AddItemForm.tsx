import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, PrimaryButton } from '../components';

interface AddItemFormProps {
  placeholder?: string;
  onSubmit: (data: string) => void;
  onCancel?: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  placeholder,
  onSubmit,
  onCancel
}) => {
  const inputData = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    inputData.current?.focus();
  }, []);

  const handleEnter = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' && inputData.current?.value.length) {
      onSubmit(inputData.current.value);
    }
  };

  return (
    <StyledAddItemForm>
      <input
        type="text"
        placeholder={placeholder}
        ref={inputData}
        onKeyPress={handleEnter}
      />
      <FormControls>
        <Button onClick={onCancel}>Cancel</Button>
        <PrimaryButton
          onClick={() =>
            inputData.current?.value.length
              ? onSubmit(inputData.current.value)
              : undefined
          }
        >
          Submit
        </PrimaryButton>
      </FormControls>
    </StyledAddItemForm>
  );
};

const StyledAddItemForm = styled.form`
  margin: 8px;
`;

const FormControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;
