"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Task } from "@/type/ProjectList/project";

export const useProjectTasks = (id : string,) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
      const res = await api.get(`/project/${id}/tasks`);
      setTasks(res.data.tasks);
      setLoading(false);
    };

  useEffect(() => {
    load();
  }, [id]);

  return { tasks, loading, refetch: load };
};
