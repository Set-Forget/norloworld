import { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'

const peopleMock = [
  {
    columnName: 'Title',
    items: [{ id: 1, name: 'Leslie Alexander' }]
  },
  {
    columnName: 'Title 2',
    items: [{ id: 2, name: 'Dora Pit' }]
  }
]

const filterPeopleMock = (mock, query) => {
  if (query === '') return mock;

  return mock
    .map(section => {
      // Filtrar la lista de items por query
      const filteredItems = section.items.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase())
      );

      // Devolver la sección (columna) junto con los items filtrados
      return { ...section, items: filteredItems };
    })
    // Filtrar las secciones que no tienen items después de filtrar
    .filter(section => section.items.length > 0);
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComboBoxGroup({ items = peopleMock, title, selectedPerson, setSelectedPerson }) {
  const [query, setQuery] = useState('')

  const filteredPeople = filterPeopleMock(items, query);

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson} className="mb-4">
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">{title}</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person) => person?.name}
          onBlur={() => {
            setQuery('');  
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map(option => (
              <>
                <Combobox.Label
                    key={option.columnName}
                    className="block w-full relative cursor-default select-none py-2 pl-3 pr-9 bg-gray-200 text-gray-800"
                  >
                  <span className={classNames('truncate', 'font-semibold')}>{option.columnName}</span>
                </Combobox.Label>
                {option.items.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    value={person}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-emerald-700 text-white' : 'text-gray-900'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span className={classNames('block truncate', selected && 'font-semibold')}>{person.name}</span>
                
                        {selected && (
                          <span
                            className={classNames(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </>
            )
            )}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

ComboBoxGroup.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  selectedPerson: PropTypes.object,
  setSelectedPerson: PropTypes.func
}