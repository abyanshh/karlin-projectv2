"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Task } from "@/type/ProjectList/project";

export const useTaskDetail = (id: string, taskId: string) => {
  const [data, setData] = useState<Task>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      const res = await api.get(`/project/${id}/tasks/${taskId}`);
      setData(res.data.task);
      setLoading(false);
    };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, refetch: fetchData };
};
