import React, { useEffect } from 'react';
import PercentageTag from '../components/PercentageTag';
import DropdownContainer from '../components/DropdownContainer';
import ManualForm from '../components/ManualForm';
import { animateScroll } from 'react-scroll';


const ManualPage: React.FC<{}> = ({}) => {
	return (
    <main className="py-2 my-5 w-full">
      <ManualForm />
    
      <section className="mt-10">
        <div className="flex flex-row items-center">
          <h1 className="text-2xl mr-3 font-bold">Reliability Score:</h1>
          <PercentageTag value={88} size="large" isLoading />
        </div>

        <ul className="mt-6 space-y-4">
          <li>
            <DropdownContainer title="Biased/Deceptive Language" percentage={99}>
              <></>
            </DropdownContainer>
          </li>

          <li>
            <DropdownContainer title="Source Reliability" percentage={100}>
              <></>
            </DropdownContainer>
          </li>
          
          <li>
            <DropdownContainer title="URL Reliability" percentage={66}>
              <></>
            </DropdownContainer>
          </li>

          <li>
            <DropdownContainer title="Cited Sources" percentage={33}>
              <></>
            </DropdownContainer>
          </li>
        </ul>
      </section>
    </main>
	)
}

export default ManualPage;