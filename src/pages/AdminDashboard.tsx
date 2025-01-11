import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*");

        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("*");

        if (tasksError) throw tasksError;
        if (usersError) throw usersError;

        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-isabelline flex items-center justify-center">
        <p className="text-cafe">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-isabelline">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl md:text-5xl text-cafe">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto py-12 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">Task Management</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.assigned_to}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">User Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.full_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Address: {user.address}</p>
                  <p>Membership Tier: {user.membership_tier}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
