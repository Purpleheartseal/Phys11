import React from 'react';
import { Lab1_1, Lab1_2, Lab1_3, Lab1_4, Lab1_5, Lab1_6 } from './Chapter1LabsA';
import { Lab1_7, Lab1_8, Lab1_9, Lab1_10, Lab1_11 } from './Chapter1LabsB';
import { Lab2_1, Lab2_2, Lab2_3 } from './Chapter2LabsA';
import { Lab2_4, Lab2_5, Lab2_6 } from './Chapter2LabsB';
import { Lab3_1, Lab3_2, Lab3_3, Lab3_4, Lab3_5, Lab3_6 } from './Chapter3LabsA';
import { Lab3_7, Lab3_8, Lab3_9, Lab3_10, Lab3_11 } from './Chapter3LabsB';

const labRegistry: Record<string, React.FC> = {
  '1-1': Lab1_1,
  '1-2': Lab1_2,
  '1-3': Lab1_3,
  '1-4': Lab1_4,
  '1-5': Lab1_5,
  '1-6': Lab1_6,
  '1-7': Lab1_7,
  '1-8': Lab1_8,
  '1-9': Lab1_9,
  '1-10': Lab1_10,
  '1-11': Lab1_11,
  '2-1': Lab2_1,
  '2-2': Lab2_2,
  '2-3': Lab2_3,
  '2-4': Lab2_4,
  '2-5': Lab2_5,
  '2-6': Lab2_6,
  '3-1': Lab3_1,
  '3-2': Lab3_2,
  '3-3': Lab3_3,
  '3-4': Lab3_4,
  '3-5': Lab3_5,
  '3-6': Lab3_6,
  '3-7': Lab3_7,
  '3-8': Lab3_8,
  '3-9': Lab3_9,
  '3-10': Lab3_10,
  '3-11': Lab3_11,
};

export const LabRouter: React.FC<{ subsectionId: string }> = ({ subsectionId }) => {
  const LabComponent = labRegistry[subsectionId];
  if (!LabComponent) return null;
  return <LabComponent key={subsectionId} />;
};
