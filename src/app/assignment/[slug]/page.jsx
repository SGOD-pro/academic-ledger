"use client"
import axios from 'axios';
import React, { useEffect, useState, lazy, memo, Suspense } from 'react';
const DOMPurify = lazy(() => import('dompurify'))
import "./style.css";
import LazyLoading from '@/components/ui/LazyLoading';
function SlugAssignment({ params }) {
  const { slug } = params;
  const [value, setValue] = useState(`<h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`);

  useEffect(() => {
    axios.get(`/api/assignment/get-data?id=${slug}`)
      .then(response => {
        setValue(response.data.data);
      })
      .catch(error => {
        console.log(error);
        setValue(` <h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`)
      });
  }, [slug]);

  return (
    <>
      {/* Use DOMPurify directly */}
      <Suspense fallback={<LazyLoading />}>
        <main className="assignment overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} />
        </main>
      </Suspense>
    </>
  );
}

export default memo(SlugAssignment);
