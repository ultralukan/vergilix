import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  status?: boolean;
  btnText: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, onClose, title, content, status = true, btnText }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          textAlign: 'center',
          outline: 'none'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: 'black'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            textAlign: "center",
            mb: 3
          }}
        >
          <Image
            src={status ? "/success.png" : "/error.png"}
            alt="icon"
            width={70}
            height={70}
          />
        </Box>

        <Typography id="modal-modal-title" variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
          {title}
        </Typography>
        {!!content && (
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {content}
        </Typography>
        )}
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ mt: 6, bgcolor: '#71E0C1', color: '#000', width: '300px', padding: '15px' }}
        >
          {btnText}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
