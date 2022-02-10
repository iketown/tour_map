import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Edit, Save, Cancel } from "@mui/icons-material";

interface TextOrField {
  defaultText: string;
  onSave: (text: string) => void;
  label?: string;
}
const TextOrField: React.FC<TextOrField> = ({
  children,
  onSave,
  defaultText,
  label,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(defaultText);
  const handleCancel = () => {
    setText(defaultText);
    setEditing(false);
  };
  const handleSave = () => {
    onSave(text);
    setEditing(false);
  };
  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);
  return editing ? (
    <TextField
      value={text}
      label={label}
      onChange={(e) => setText(e.target.value)}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton color="primary" onClick={handleSave}>
              <Save />
            </IconButton>
            <IconButton color="warning" onClick={handleCancel}>
              <Cancel />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  ) : (
    <Box display="flex" alignItems={"center"}>
      {children ? (
        <div>{children}</div>
      ) : (
        <pre style={{ color: "maroon" }}>{defaultText}</pre>
      )}
      <IconButton onClick={() => setEditing(true)} sx={{ ml: 2 }}>
        <Edit />
      </IconButton>
    </Box>
  );
};

export default TextOrField;
