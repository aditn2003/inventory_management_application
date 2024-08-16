'use client'
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Modal, Typography, Stack, TextField, Button, IconButton} from "@mui/material";
import {collection, query, getDocs, doc, deleteDoc, getDoc, setDoc} from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import '@fontsource/roboto';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredInventory = inventory.filter(({name}) => 
    name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: "#212121",
        padding: 4,
        fontFamily: "Roboto, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Top Section: Title */}
      <Typography variant="h3" gutterBottom color="#FF9800" align="center" sx={{ marginBottom: "2rem" }}>
        Inventory Management Application
      </Typography>

      {/* Middle Section: Inventory List */}
      <Box width="800px" bgcolor="#333333" borderRadius={2} boxShadow={2} p={3} flexGrow={1} height="60vh" overflow="auto">
        <Typography variant="h4" align="center" color="#FF9800" gutterBottom>
          Inventory Items
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search Items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            bgcolor: "#333",  
            borderRadius: 1,
            borderColor: "orange",  
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "orange",
              },
              "&:hover fieldset": {
                borderColor: "orange",
              },
              "&.Mui-focused fieldset": {
                borderColor: "orange",
              },
              "& input": {
                color: "white",  
              },
              "& input::placeholder": {
                color: "white",  
              },
            },
            marginTop: 2,
            marginBottom: 2, 
            width: "100%",  
          }}
        />
        <Stack spacing={2}>
          {filteredInventory.length > 0 ? filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#424242"
              borderRadius={2}
              boxShadow={1}
            >
              <Typography variant="h6" color="#FF9800">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#FF9800">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  sx={{
                    backgroundColor: "#FF9800",
                    color: "#212121",
                    transition: "transform 0.2s, background-color 0.2s",
                    '&:hover': {
                      backgroundColor: "#ffffff",
                      color: "#FF9800",
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => addItem(name)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: "#FF9800",
                    color: "#212121",
                    transition: "transform 0.2s, background-color 0.2s",
                    '&:hover': {
                      backgroundColor: "#ffffff",
                      color: "#FF9800",
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => removeItem(name)}
                >
                  <RemoveIcon />
                </IconButton>
              </Stack>
            </Box>
          )): (
            <Typography variant="h6" color="white" textAlign="center">
              No items match your search.
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Bottom Section: Add New Item Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: "#FF9800",
          color: "#212121",
          transition: "transform 0.2s, background-color 0.2s",
          '&:hover': {
            backgroundColor: "#ffffff",
            color: "#FF9800",
            transform: "scale(1.05)",
          },
          marginTop: "2rem",
        }}
      >
        Add New Item
      </Button>

      {/* Modal for Adding Item */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#ffffff"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: 2,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          <Typography variant="h6" color="#FF9800">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                backgroundColor: "#FF9800",
                color: "#212121",
                transition: "transform 0.2s, background-color 0.2s",
                '&:hover': {
                  backgroundColor: "#ffffff",
                  color: "#FF9800",
                  transform: "scale(1.05)",
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
