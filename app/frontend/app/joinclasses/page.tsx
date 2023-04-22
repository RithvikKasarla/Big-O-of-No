"use client";
import React, { useState, useEffect } from "react";
import config from "../../config";
import { useContext } from "react";
import { HeaderContext } from "../HeaderContext";

function JoinClassesPage() {
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const { setHeaderData, headerData } = useContext(HeaderContext);

  useEffect(() => {
    fetch(`${config.apiUrl}/class/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => {
        // console.log(response);
        return response.json(); // return the parsed JSON data here
      })
      .then((data) => setClasses(data))
      .catch((error) => console.log(error)); // always add a catch block to handle errorsgi
  }, []);

  function handleClassSelection(classId: number) {
    const isSelected = selectedClasses.includes(classId);
    if (isSelected) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  }

  // function handleJoinClasses(e) {
  //   e.preventDefault();
  //   // send an API call to join the selected classes
  //   const promises = selectedClasses.map((classId) => {
  //     console.log(localStorage.getItem("token"));
  //     console.log(classId);
  //     return fetch(`${config.apiUrl}/class/${classId}/join`, {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         token: localStorage.getItem("token"),
  //       }),
  //     })
  //       .then((response) => {
  //         return response.json();
  //       })
  //       .then((data) => setClasses(data))
  //       .catch((error) => console.log(error));
  //   });

  //   Promise.all(promises).then((results) => {
  //     console.log(results);
  //     console.log("RAISED");
  //     // Set the classes-updated flag in localStorage to trigger an update of the class list
  //     localStorage.setItem("classes-updated", "true");
  //     setHeaderData((headerData) => !headerData);
  //   });
  // }

  function handleJoinClasses(e: any) {
    e.preventDefault();
    const promises = selectedClasses.map((classId) => {
      return fetch(`${config.apiUrl}/class/${classId}/join`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => console.log(error));
    });

    Promise.all(promises)
      .then(() => {
        // Fetch the updated list of classes and update the classes state
        fetch(`${config.apiUrl}/class/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        })
          .then((response) => response.json())
          .then((data) => setClasses(data))
          .catch((error) => console.log(error));
      })
      .then(() => {
        // Set the classes-updated flag in localStorage to trigger an update of the class list
        localStorage.setItem("classes-updated", "true");
        setHeaderData((headerData) => !headerData);
      });
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Classes</h1>
      {classes && Array.isArray(classes) && (
        <ul className="max-w-md w-full space-y-4">
          {classes.map((c) => (
            <li key={c.id} className="bg-white rounded-md p-4 shadow-md">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={selectedClasses.includes(c.id)}
                  onChange={() => handleClassSelection(c.id)}
                />
                <span className="text-gray-900 font-medium">{c.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleJoinClasses}
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
      >
        Join selected classes
      </button>
    </div>
  );
}

export default JoinClassesPage;

// Promise.all(promises)
//   .then((responses) => {
//     console.log(responses);
//     if (responses.every((r) => r.ok)) {
//       alert("You have joined the selected classes!");
//     } else {
//       alert("Failed to join some classes.");
//     }
//   })
//   .catch((error) => {
//     console.error("Failed to join the classes:", error);
//     alert("Failed to join some classes.");
//   });
