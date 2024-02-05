import { memo, useContext, useEffect, useReducer, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { StateContext } from "../../store/DataProvider";
import Page from "../../components/Page";
import ClientTable from "./ClientTable";
import { getClients, createClient } from "../../services/api";

// Define the IClientForm interface
interface IClientForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// Define the Action type
type ActionType =
  | { type: "FETCH_ALL_CLIENTS"; data: IClient[] }
  | { type: "CREATE_CLIENT"; data: IClient };

// Define the reducer function
const reducer = (state: IApplicationState, action: ActionType): IApplicationState => {
  switch (action.type) {
    case "FETCH_ALL_CLIENTS":
      return { ...state, clients: action.data };

    case "CREATE_CLIENT":
      return { ...state, clients: [...state.clients, action.data] };

    default:
      return state;
  }
};

function Clients() {
  const { state, dispatch } = useContext(StateContext);
  const { clients } = state;

  // State for managing the modal steps
  const [activeStep, setActiveStep] = useState(0);

  // State for storing the search term and new client details
  const [searchTerm, setSearchTerm] = useState("");
  const [creatingNewClient, setCreatingNewClient] = useState(false);
  const [newClient, setNewClient] = useState<IClientForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenDeleteDialog = () => {
    if (selectedClientIds.size > 0) {
      setIsDeleteDialogOpen(true);
    }
  };

  // The function to delete selected clients
  const handleDeleteSelectedClients = async () => {
    // Close the dialog first
    setIsDeleteDialogOpen(false);

    // TODO: Add logic to delete clients using the selectedClientIds

    // Clear the selected clients after deletion
    setSelectedClientIds(new Set<string>());
  };

  // Add this state to the Clients component
  const [selectedClientIds, setSelectedClientIds] = useState(new Set<string>());

  // Add this handler function to the Clients component
  const handleCheckboxChange = (clientId: string) => {
    setSelectedClientIds(prevSelectedClientIds => {
      const newSelectedClientIds = new Set(prevSelectedClientIds);
      if (newSelectedClientIds.has(clientId)) {
        newSelectedClientIds.delete(clientId);
      } else {
        newSelectedClientIds.add(clientId);
      }
      return newSelectedClientIds;
    });
  };


  // Use useReducer hook to manage state with the reducer function
  const [, localDispatch] = useReducer(reducer, state);

  // Fetch clients from the API when the component mounts
  useEffect(() => {
    getClients().then((clients) =>
      dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
    );
  }, [dispatch]);

  // Filter clients based on the search term
  const filteredClients = clients.filter((client) =>
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes in the new client form
  const handleNewClientChange = (field: keyof IClientForm, value: string) => {
    setNewClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

  // Handle the creation of a new client
  const handleCreateNewClient = async () => {
    try {
      // Create a new object of type IClient by spreading newClient and adding an empty id
      const clientToCreate: IClient = { ...newClient, id: "" };

      const createdClient = await createClient(clientToCreate);
      if (createdClient !== undefined) {
        // If createClient returns the created client, update the state
        localDispatch({ type: "CREATE_CLIENT", data: createdClient }); // Use global dispatch
        // dispatch({ type: "CREATE_CLIENT", data: createdClient });
        window.location.reload();

        // Reset the form and exit the creation mode
        setNewClient({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
        });
        
        setCreatingNewClient(false);
        setActiveStep(0); // Reset the active step

      } else {
        console.error("Error creating client: Invalid response from the server");
        // Handle the case where the server response is invalid
      }
    } catch (error) {
      // Handle error accordingly
      console.error("Error creating client:", error);
    }
  };

  // Handle the "Continue" button click in the modal
  const handleContinue = () => {
    if (activeStep === 0) {
      // If in the "Personal Details" step, proceed to the next step
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // If in the "Contact Details" step, create the new client
      handleCreateNewClient();
    }
  };

  // Handle the "Back" button click in the modal
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Page>
      <Typography variant="h4" sx={{ textAlign: "start" }}>
        Clients
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: 2 }}>
        {/* Search Input */}
        <TextField
          label="Search clients..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, marginRight: 2 }}
        />
        
        {/* Create New Client Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreatingNewClient(true)}
        >
          Create new client
        </Button>
      </Box>

      {/* Create New Client Dialog */}
      <Dialog open={creatingNewClient} onClose={() => setCreatingNewClient(false)}>
        <DialogTitle>Create New Client</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Personal Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Contact Details</StepLabel>
            </Step>
          </Stepper>
          <Box sx={{ mt: 2 }}> {/* Add margin to the top of the content */}
            {/* Personal Details Step */}
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth // Make the TextField take the full width
                  margin="normal" // Add the standard MUI margin
                  label="First Name"
                  variant="outlined"
                  value={newClient.firstName}
                  onChange={(e) => handleNewClientChange("firstName", e.target.value)}
                />
                <TextField
                  fullWidth // Make the TextField take the full width
                  margin="normal" // Add the standard MUI margin
                  label="Last Name"
                  variant="outlined"
                  value={newClient.lastName}
                  onChange={(e) => handleNewClientChange("lastName", e.target.value)}
                />
              </Box>
            )}

            {/* Contact Details Step */}
            {activeStep === 1 && (
              <Box>
                <TextField
                  fullWidth // Make the TextField take the full width
                  margin="normal" // Add the standard MUI margin
                  label="Email"
                  variant="outlined"
                  value={newClient.email}
                  onChange={(e) => handleNewClientChange("email", e.target.value)}
                />
                <TextField
                  fullWidth // Make the TextField take the full width
                  margin="normal" // Add the standard MUI margin
                  label="Phone Number"
                  variant="outlined"
                  value={newClient.phoneNumber}
                  onChange={(e) => handleNewClientChange("phoneNumber", e.target.value)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={activeStep === 1 ? handleCreateNewClient : handleContinue}>
            {activeStep === 1 ? "Create Client" : "Continue"}
          </Button>
        </DialogActions>
      
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the selected client(s)?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteSelectedClients} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>

      {/* Display a Paper component containing a table of clients */}
      <Paper sx={{ margin: "auto", marginTop: 3 }}>
        <ClientTable clients={filteredClients} />
      </Paper>
    </Page>
  );
}

export default memo(Clients);
