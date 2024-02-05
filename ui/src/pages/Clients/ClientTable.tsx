import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ClientRow from "./ClientRow";

export default function BasicTable({ clients }: { clients: IClient[] }) {
  const [selectedClientIds, setSelectedClientIds] = useState(new Set<number>());

  const handleCheckboxChange = (clientId: number) => {
    const newSelectedClientIds = new Set(selectedClientIds);
    if (newSelectedClientIds.has(clientId)) {
      newSelectedClientIds.delete(clientId);
    } else {
      newSelectedClientIds.add(clientId);
    }
    setSelectedClientIds(newSelectedClientIds);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone number</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              isSelected={selectedClientIds.has(Number(client.id))}
              // Assuming client.id is a string, convert it to a number before passing it to handleCheckboxChange
              onCheckboxChange={() => handleCheckboxChange(Number(client.id))}

            />
          ))}
          {!clients || (!clients.length && (
            <TableRow sx={{ padding: 3 }}>
              <TableCell component="th" scope="row">
                No clients
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
