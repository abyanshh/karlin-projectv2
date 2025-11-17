"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { ProfileMember } from "@/type/ProjectList/project";

export const useStaffList = () => {
  const [staffList, setStaffList] = useState<ProfileMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
      const res = await api.get(`/profile`);
      setStaffList(res.data.profiles);
      console.log(res.data.profiles);
      setLoading(false);
    };

  useEffect(() => {
    load();
  }, []);

  return { staffList, loading, refetch: load };
};

