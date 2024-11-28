// FormField.tsx
import { Tooltip } from '@mui/material';
import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';

interface FormFieldProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  tooltip,
  type = 'text',
  value,
  onChange,
}) => {
  return (
    <Form.Group className="mb-3" as={Row}>
      <Form.Label className="fs-6" column sm={4}>
        {label}
        {required && (
          <span>
            <Tooltip arrow title="Обязательное поле" placement="top">
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}>
                <span>*</span>
              </span>
            </Tooltip>
          </span>
        )}
        {tooltip && (
          <Tooltip arrow title={tooltip} placement="top">
            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'blue' }}>
              <span>*</span>
            </span>
          </Tooltip>
        )}
      </Form.Label>
      <Col sm={8}>
        <Form.Control type={type} value={value} autoComplete="off" onChange={onChange} />
      </Col>
    </Form.Group>
  );
};

export default FormField;
