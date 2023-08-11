import useAxios from 'axios-hooks'

import ComboBox from "./ComboBox"
import ComboBoxGroup from './ComboBoxGroup'
import Spinner from "./Spinner"
import { useState } from 'react'

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
  });
}

export default function MainForm() {
  const [{ data, loading, error }] = useAxios(
    'https://script.google.com/macros/s/AKfycbxSR2VeXXibw1KqSNg2U05Nd1PHyKMxp-G0LX5UFX8NTO58uBQ2M2lgNE8tRSmpLnQX/exec?route=getIncidents'
  )

  const [{ postData, postLoading, postError }, executePost] = useAxios(
    {
      url: 'https://script.google.com/macros/s/AKfycbxSR2VeXXibw1KqSNg2U05Nd1PHyKMxp-G0LX5UFX8NTO58uBQ2M2lgNE8tRSmpLnQX/exec?route=createIncident',
      method: 'POST'
    },
    { manual: true }  // Este flag permite que la llamada se ejecute manualmente
  );

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [submittedBy, setSubmittedBy] = useState(null)
  const [description, setDescription] = useState('')
  const [fileData, setFileData] = useState({});
  const [warning, setWarning] = useState(false)

  const handleFileChange = async (event) => {
    const myFile = event.target.files[0];
    if (myFile) {
        const contentBase64String = await readFileAsBase64(myFile);
        const contentType = myFile.type;
        const fileName = myFile.name;
        const file = { content: contentBase64String, contentType, fileName };
        setFileData(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDriver || !selectedIncident || !submittedBy || !description) {
      return setWarning(true)
    }
    const body = {
      driverName: selectedDriver,
      datetime: new Date().toISOString(),
      description,
      incident: selectedIncident,
      submittedBy,
      file: fileData
    }
    console.log("Body :", body)
    await executePost({ data: body })
  }

  if (error || postError) return <h2 className="text-lg text-center p-4">Error</h2>
  if (loading || postLoading) return <Spinner />

  return(
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-4">
          <ComboBox
            title="* Driver Name"
            items={data.drivers.map((name, i) => ({ id: i, name }))}
            selectedPerson={selectedDriver}
            setSelectedPerson={setSelectedDriver}
          />
          <ComboBoxGroup
            title="* Incident Type"
            items={data.types.map(typeone => ({
                ...typeone, 
                items: typeone.items.map(item => ({ id: item , name: item })) 
              })
            )}
            selectedPerson={selectedIncident}
            setSelectedPerson={setSelectedIncident}
          />
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
              * Description
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="comment"
                id="comment"
                onChange={e => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={''}
              />
            </div>
          </div>
          <ComboBox title="* Submitted by"
            items={data.drivers.map((name, i) => ({ id: i, name }))}
            selectedPerson={submittedBy}
            setSelectedPerson={setSubmittedBy}
          />
          <div>
            <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">Attachment upload</label>
            <div className="mt-2">
            <input
              type="file"
              id="inputfile"
              onChange={handleFileChange}
              className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700" />
            </div>
          </div>
          {warning && (
            <p className="text-sm text-red-600 mt-8 mb-4" id="email-error">
              Complete the required fields *
            </p>
          )}
          {postData && (
            <p className="text-sm text-teal-600 mt-8 mb-4">
              Submitted
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className={`${!warning && 'mt-4'} rounded-md bg-emerald-700 px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
      >
        Submit
      </button>
    </form>
  )
}