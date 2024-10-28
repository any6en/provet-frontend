import React, { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

const AutoResizeTextarea: React.FC<{
  value: string;
  onChange: (e: any) => void;
  readOnly?: boolean; // Добавляем пропс readOnly
}> = ({ value, onChange, readOnly = false }) => {
  // По умолчанию false
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null); // Указываем тип

  const autoResizeTextArea = (e: any) => {
    e.target.style.height = 'auto'; // Сброс высоты
    e.target.style.height = `${e.target.scrollHeight}px`; // Устанавливаем новую высоту
  };

  useEffect(() => {
    if (textAreaRef.current) {
      // Устанавливаем высоту при загрузке
      textAreaRef.current.style.height = 'auto'; // Сброс высоты
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Устанавливаем новую высоту
    }
  }, [value]); // Перезапускаем эффект, если значение меняется

  return (
    <Form.Control
      as="textarea"
      ref={textAreaRef}
      rows={1}
      value={value || ''}
      onChange={
        readOnly
          ? undefined
          : (e: any) => {
              autoResizeTextArea(e);
              onChange(e);
            }
      } // Пребразуем обработчик onChange в зависимости от readOnly
      readOnly={readOnly} // Устанавливаем readOnly для поля
      style={{ resize: 'none', overflow: 'hidden' }} // Отключаем ручное изменение размера
    />
  );
};

export default AutoResizeTextarea;
