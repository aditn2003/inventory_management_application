'use client'
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Modal, Typography, Stack, TextField, Button, IconButton} from "@mui/material";
import {collection, query, getDocs, doc, deleteDoc, getDoc, setDoc} from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    } else {
      await setDoc(docRef, {quantity: 1});
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {quantity: quantity - 1});
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 4,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Inventory Management
      </Typography>
      
      <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
        Add New Item
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="800px" bgcolor="#fff" borderRadius={2} boxShadow={2} p={3}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Inventory Items
        </Typography>
        <Stack spacing={2} overflow="auto">
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#fafafa"
              borderRadius={2}
              boxShadow={1}
            >
              <Typography variant="h6">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  color="primary"
                  onClick={() => addItem(name)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => removeItem(name)}
                >
                  <RemoveIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
