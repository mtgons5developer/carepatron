import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";

export default function ClientRow({
  client,
  onCheckboxChange,
  isSelected
}: {
  client: IClient;
  onCheckboxChange: (clientId: number) => void;
  isSelected: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isSelected);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state locally
    onCheckboxChange(Number(client.id)); // Notify the parent component about the change
  };

  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>{client.firstName}</TableCell>
      <TableCell>{client.lastName}</TableCell>
      <TableCell>{client.phoneNumber}</TableCell>
      <TableCell>{client.email}</TableCell>
    </TableRow>
  );
}
