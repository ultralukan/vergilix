import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  status?: boolean;
  btnText: string;
  link?: string;
  onButtonClick?: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, onClose, title, content, status = true, btnText, link, onButtonClick }) => {

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };
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
          minWidth: 600,
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
        <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
          {content}
        </Typography>
        )}
        <Button
          onClick={handleButtonClick}
          variant="contained"
          sx={{ mt: 6, bgcolor: '#71E0C1', color: '#000', width: '300px', padding: '15px', fontWeight: 'bold', fontSize: '16px' }}
        >
          {btnText}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
