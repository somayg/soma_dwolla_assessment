import * as React from 'react';
import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { Box } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { blue } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

const emails = ['customer1@example.com', 'customer2@example.com', 'customer3@example.com'];

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose('');
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
  });

  //CHANGE: Created Function to Add Customer (refer to 319 webpages)
  const handleAdd =async () => {
    if(!customer.firstName || !customer.lastName || !customer.email || !customer.businessName){
      alert("Please fill all fields");
      return;
    }

    try{
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if(response.ok){
        const text = await response.text();
        const newCustomer = text ? JSON.parse(text) : {}; //Parse only if not empty
        console.log("New Customer:", newCustomer);
        handleClose();
      }
    }catch(error){
      console.error("An error occurred while adding customer", error);
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
      <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={customer.firstName}
            onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={customer.lastName}
            onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="businessName"
            label="Business Name"
            type="text"
            fullWidth
            variant="standard"
            value={customer.businessName}
            onChange={(e) => setCustomer({ ...customer, businessName: e.target.value
            })}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleAdd}>Add +</Button>
        </DialogActions>
    </Dialog>
  );
}

const Home = () => {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };

  const { data, error, isLoading } = useSWR<Customers, ApiError>('/api/customers', fetcher);
  const Customers = data || [];

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    console.log("Selected Value:", value);
  };

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Button variant="text">{Customers.length} Customers</Button>
        <Button variant="contained" onClick={handleClickOpen}>Add Customer +</Button>

        {/* Fix: Render SimpleDialog Here */}
        <SimpleDialog open={open} onClose={handleClose} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </>
  );
};

export default Home;
