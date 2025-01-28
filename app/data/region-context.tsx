import React, {createContext, useContext, useEffect, useState} from 'react';
import {HttpTypes} from '@medusajs/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@api/client';

type RegionContextType = {
  region?: HttpTypes.StoreRegion;
  setRegion: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreRegion | undefined>
  >;
};

const RegionContext = createContext<RegionContextType | null>(null);

type RegionProviderProps = {
  children: React.ReactNode;
};

export const RegionProvider = ({children}: RegionProviderProps) => {
  const storageKey = 'region_id';
  const [region, setRegion] = useState<HttpTypes.StoreRegion>();

  useEffect(() => {
    if (region) {
      // set its ID in the local storage in
      // case it changed
      AsyncStorage.setItem(storageKey, region.id);
      return;
    }

    AsyncStorage.getItem(storageKey).then(regionId => {
      if (!regionId) {
        // retrieve regions and select the first one
        apiClient.store.region.list().then(data => {
          const regions = data.regions;
          setRegion(regions[0]);
        });
      } else {
        // retrieve selected region
        apiClient.store.region
          .retrieve(regionId)
          .then(({region: dataRegion}) => {
            setRegion(dataRegion);
          });
      }
    });
  }, [region]);

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
      }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);

  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }

  return context;
};
