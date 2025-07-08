import React from "react";

const LessonPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;

  return <div>{params.slug}</div>;
};

export default LessonPage;
