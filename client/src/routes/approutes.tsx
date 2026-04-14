import type { ChangeEvent } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/applayout";
import FloatingLabelInput from "../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../components/input/Select/FloatingLabelSelect";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/table/index";

const SampleComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const genders = [
    { value: "", text: "Select Gender" },
    { value: "1", text: "Male" },
    { value: "2", text: "Female" },
    { value: "3", text: "Prefer Not To Say" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-red-600 mb-4 text-2xl font-bold italic">Hello World</h1>

      <div className="mb-4">
        <FloatingLabelInput
          label="First Name"
          type="text"
          name="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoFocus
        />
        <p className="font-medium">First Name: {firstName}</p>
      </div>

      <div className="mb-4">
        <FloatingLabelInput
          label="Last Name"
          type="text"
          name="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <p className="font-medium">Last Name: {lastName}</p>
      </div>

      <div className="mb-4">
        <FloatingLabelInput
          label="Birth Date"
          type="date"
          name="birth_date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <p className="font-medium">Birth Date: {birthDate}</p>
      </div>

      <div className="mb-4">
        <FloatingLabelInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="font-medium">Password: {password}</p>
      </div>

      <div className="mb-4">
        <FloatingLabelSelect
          label="Gender"
          name="gender"
          value={gender}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}
        >
          {genders.map((gender, index) => (
            <option value={gender.value} key={index}>
              {gender.text}
            </option>
          ))}
        </FloatingLabelSelect>
        <p className="font-medium">Gender: {gender}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b bg-gray-50">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  No.
                </TableCell>
                {/* Tinanggal ang Gender Value Header dito */}
                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                  Gender
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {genders.map((gender, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {index + 1}
                  </TableCell>
                  {/* Tinanggal ang gender.value Cell dito */}
                  <TableCell className="px-4 py-3 text-start">
                    {gender.text}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<SampleComponent />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;