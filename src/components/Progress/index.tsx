import { Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export function LinearWithValueLabel() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 20));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}


export function LinearIndeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress 
      sx={{
        backgroundColor: 'white',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#6BE8C2'
        }
      }}/>
    </Box>
  );
}