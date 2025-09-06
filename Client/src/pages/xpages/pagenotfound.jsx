import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/')
  }, [])
  return
}