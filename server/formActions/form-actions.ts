"use client";

import useLoading from "@/hooks/use-loading";
import {
  tagSchemaValues,
  UnitsSchemaValues,
  vocabularySchemaValues,
} from "@/schemas/form-schemas";
import { LessonFormType } from "@/schemas/units-schemas";
import toast from "react-hot-toast";

const toastError = (action: string, path: string) => {
  return toast.error(
    `There was an error ${action == "POST" ? "creating" : "editing"} ${path}}.`,
    {
      style: {
        background: "#ffeef0",
        color: "#943c5e",
        borderRadius: "10px",
        padding: "12px 18px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
        fontSize: "16px",
      },
      className:
        "transition-all transform duration-300 ease-in-out font-medium",
    }
  );
};

const lessonAction = async (
  data: LessonFormType,
  action: string,
  stopLoading: () => void,
  lessonId?: string
) => {
  const URL = lessonId ? `/api/lessons/${lessonId}` : "/api/lessons";
  const res = await fetch(URL, {
    method: action,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toastError(action, "lesson");
    stopLoading();
    return;
  }
};

const tagActions = async (
  data: tagSchemaValues,
  action: string,
  stopLoading: () => void,
  tagId?: string
) => {
  const URL = tagId ? `/api/tags/${tagId}` : "/api/tags";
  const res = await fetch(URL, {
    method: action,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toastError(action, "tag");
    stopLoading();
    return;
  }
};

const unitAction = async (
  data: UnitsSchemaValues,
  action: string,
  stopLoading: () => void,
  unitId?: string
) => {
  const URL = unitId ? `/api/units/${unitId}` : "/api/units";
  const res = await fetch(URL, {
    method: action,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toastError(action, "unit");
    stopLoading();
    return;
  }
};
const vocabularyAction = async (
  data: vocabularySchemaValues,
  action: string,
  stopLoading: () => void,
  vocabularyId?: string
) => {
  const URL = vocabularyId
    ? `/api/vocabulary/${vocabularyId}`
    : "/api/vocabulary";
  const res = await fetch(URL, {
    method: action,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toastError(action, "vocabulary");
    stopLoading();
    return;
  }
};

export { lessonAction, tagActions, unitAction, vocabularyAction };
