import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const terminals = [
  {
    name: "EETL",
    port: "Port Qasim",
    city: "Karachi",
    owner: "Engro Elengy Terminal Ltd",
  },
  {
    name: "PGPCL",
    port: "Port Qasim",
    city: "Karachi",
    owner: "Pakistan GasPort Consortium Limited",
  },
];

export function TerminalsTable() {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">LNG Terminals</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Terminal Name</TableHead>
              <TableHead className="text-center">Port Name</TableHead>
              <TableHead className="text-center">City</TableHead>
              <TableHead className="text-center">Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terminals.map((terminal) => (
              <TableRow key={terminal.name}>
                <TableCell className="font-medium text-center">{terminal.name}</TableCell>
                <TableCell className="text-center">{terminal.port}</TableCell>
                <TableCell className="text-center">{terminal.city}</TableCell>
                <TableCell className="text-center">{terminal.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}