import React, { useMemo } from 'react';
import { Edit3, Trash2, PlusCircle, Briefcase } from 'lucide-react';
import DataManager from '../DataManager/DataManager';
import styles from './AssetsManager.module.scss';

interface Asset {
  id: string;
  name: string;
  valueINR: number;
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
  [key: string]: string | number;
}

interface AssetsManagerProps {
  assets: Asset[];
  saveData: (collection: string, data: any, id?: string) => Promise<string | null>;
  deleteData: (collection: string, id: string) => Promise<void>;
  openModal: (content: React.ReactNode) => void;
  darkMode: boolean;
}

const formatCurrency = (amount: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const AssetsManager: React.FC<AssetsManagerProps> = ({ 
  assets, 
  saveData, 
  deleteData, 
  openModal, 
  darkMode 
}) => {
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'valueINR', label: 'Value (INR)' },
    { key: 'assetClass', label: 'Class' },
    { key: 'assetType', label: 'Type' },
    { key: 'fpAssetClass', label: 'FP Class' },
  ], []);

  const renderRow = (item: Asset, cols: { key: string; label: string }[]) => {
    return cols.map(col => (
      <td key={col.key} className={`${styles.cell} ${col.key === 'valueINR' ? styles.currency : ''}`}>
        {col.key === 'valueINR' ? formatCurrency(item[col.key] as number) : item[col.key] || '-'}
      </td>
    ));
  };

  const renderHeader = (cols: { key: string; label: string }[]) => {
    return cols.map(col => (
      <th key={col.key} className={styles.header}>
        {col.label}
      </th>
    ));
  };

  const renderActions = (item: Asset) => (
    <div className={styles.actions}>
      <button
        className={`${styles.actionButton} ${darkMode ? styles.editButtonDark : styles.editButtonLight}`}
        onClick={(e) => {
          e.stopPropagation();
          openModal(
            <DataManager
              title="Edit Asset"
              items={[item]}
              itemType="asset"
              saveData={saveData}
              deleteData={deleteData}
              openModal={openModal}
              columns={columns}
              renderRow={renderRow}
              darkMode={darkMode}
              editMode={true}
            />
          );
        }}
        aria-label={`Edit ${item.name}`}
      >
        <Edit3 size={18} />
      </button>
      <button
        className={`${styles.actionButton} ${darkMode ? styles.deleteButtonDark : styles.deleteButtonLight}`}
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
            deleteData('asset', item.id);
          }
        }}
        aria-label={`Delete ${item.name}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className={`${styles.assetsManager} ${darkMode ? 'dark' : 'light'}`}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {renderHeader(columns)}
              <th className={styles.header} style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((item) => (
                <tr 
                  key={item.id} 
                  className={styles.row}
                  onClick={() => {
                    openModal(
                      <DataManager
                        title="Edit Asset"
                        items={[item]}
                        itemType="asset"
                        saveData={saveData}
                        deleteData={deleteData}
                        openModal={openModal}
                        columns={columns}
                        editMode={true}
                        darkMode={darkMode}
                      />
                    );
                  }}
                >
                  {renderRow(item, columns)}
                  <td className={styles.cell}>
                    {renderActions(item)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className={styles.emptyState}>
                  <div className={styles.emptyStateContent}>
                    <Briefcase size={48} className={styles.emptyStateIcon} />
                    <h3>No assets found</h3>
                    <p>Get started by adding your first asset</p>
                    <button 
                      className={`${styles.addButton} ${darkMode ? styles.addButtonDark : styles.addButtonLight}`}
                      onClick={() => {
                        openModal(
                          <DataManager
                            title="Add New Asset"
                            items={[{}]}
                            itemType="asset"
                            saveData={saveData}
                            deleteData={deleteData}
                            openModal={openModal}
                            columns={columns}
                            renderRow={renderRow}
                            darkMode={darkMode}
                            editMode={false}
                          />
                        );
                      }}
                    >
                      <PlusCircle size={18} style={{ marginRight: '8px' }} />
                      Add Your First Asset
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetsManager; 