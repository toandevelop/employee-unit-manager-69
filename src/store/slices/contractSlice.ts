
import { create } from 'zustand';
import { contractTypes as initialContractTypes, contracts as initialContracts } from '../../data/mockData';
import { ContractType, Contract } from '../../types';
import { toast } from 'sonner';

interface ContractState {
  contractTypes: ContractType[];
  contracts: Contract[];
  
  addContractType: (contractType: Omit<ContractType, 'id' | 'contracts'>) => void;
  updateContractType: (id: string, contractType: Partial<ContractType>) => void;
  deleteContractType: (id: string) => void;
  
  addContract: (contract: Omit<Contract, 'id' | 'employee' | 'contractType'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
}

export const createContractSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  contractTypes: initialContractTypes,
  contracts: initialContracts,
  
  addContractType: (contractTypeData) => {
    set((state: any) => {
      const newId = (Math.max(...state.contractTypes.map(ct => parseInt(ct.id) || 0), 0) + 1).toString();
      
      const newContractType: ContractType = {
        id: newId,
        ...contractTypeData,
        contracts: []
      };
      
      toast.success("Thêm loại hợp đồng thành công");
      
      return {
        contractTypes: [...state.contractTypes, newContractType]
      };
    });
  },
  
  updateContractType: (id, contractTypeData) => {
    set((state: any) => {
      const updatedContractTypes = state.contractTypes.map(ct => 
        ct.id === id ? { ...ct, ...contractTypeData } : ct
      );
      
      toast.success("Cập nhật loại hợp đồng thành công");
      
      return {
        contractTypes: updatedContractTypes
      };
    });
  },
  
  deleteContractType: (id) => {
    set((state: any) => {
      const hasContracts = state.contracts.some(c => c.contractTypeId === id);
      
      if (hasContracts) {
        toast.error("Không thể xoá loại hợp đồng đang có hợp đồng");
        return state;
      }
      
      toast.success("Xoá loại hợp đồng thành công");
      
      return {
        contractTypes: state.contractTypes.filter(ct => ct.id !== id)
      };
    });
  },
  
  addContract: (contractData) => {
    set((state: any) => {
      const newId = (Math.max(...state.contracts.map(c => parseInt(c.id) || 0), 0) + 1).toString();
      
      const newContract: Contract = {
        id: newId,
        ...contractData
      };
      
      toast.success("Thêm hợp đồng thành công");
      
      return {
        contracts: [...state.contracts, newContract]
      };
    });
  },
  
  updateContract: (id, contractData) => {
    set((state: any) => {
      const updatedContracts = state.contracts.map(c => 
        c.id === id ? { ...c, ...contractData } : c
      );
      
      toast.success("Cập nhật hợp đồng thành công");
      
      return {
        contracts: updatedContracts
      };
    });
  },
  
  deleteContract: (id) => {
    set((state: any) => {
      toast.success("Xoá hợp đồng thành công");
      
      return {
        contracts: state.contracts.filter(c => c.id !== id)
      };
    });
  },
});
