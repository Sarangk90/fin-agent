from typing import List, Dict, Any
from ..models.liability_models import LiabilityIn, LiabilityOut, dummy_liabilities_db, next_liability_id_counter
from fastapi import HTTPException

async def get_liabilities_service() -> List[LiabilityOut]:
    """Retrieves all liabilities from the dummy database."""
    return [LiabilityOut(**liability_data) for liability_data in dummy_liabilities_db]

async def create_liability_service(liability_data: LiabilityIn) -> LiabilityOut:
    """Creates a new liability in the dummy database."""
    global next_liability_id_counter, dummy_liabilities_db
    new_liability_dict = liability_data.model_dump(exclude_none=True) # Exclude Nones for optional fields
    new_liability_dict["id"] = str(next_liability_id_counter)
    dummy_liabilities_db.append(new_liability_dict)
    next_liability_id_counter += 1
    return LiabilityOut(**new_liability_dict)

async def update_liability_service(liability_id: str, liability_update_data: LiabilityIn) -> LiabilityOut | None:
    """Updates an existing liability in the dummy database."""
    global dummy_liabilities_db
    for i, liability in enumerate(dummy_liabilities_db):
        if liability.get("id") == liability_id:
            # model_dump(exclude_unset=True) is good for PATCH, but for PUT, we usually replace all fields defined in the model.
            # model_dump(exclude_none=True) will not send None values to the db, effectively clearing them if not provided.
            updated_data = liability_update_data.model_dump(exclude_none=True) 
            
            # Create the new state of the liability
            # Start with the existing liability, then overlay the updates.
            # Crucially, ensure all fields from LiabilityBase are potentially updatable.
            current_liability_data = dummy_liabilities_db[i].copy()
            
            # Update fields from updated_data
            for key, value in updated_data.items():
                current_liability_data[key] = value
            
            # Explicitly set fields to None if they were None in liability_update_data and we want to clear them
            # This assumes liability_update_data contains all fields, with explicit None for clearing
            if 'interestRate' not in updated_data and liability_update_data.interestRate is None:
                 current_liability_data['interestRate'] = None
            if 'dueDate' not in updated_data and liability_update_data.dueDate is None:
                 current_liability_data['dueDate'] = None

            # Ensure the ID is preserved
            current_liability_data["id"] = liability_id
            dummy_liabilities_db[i] = current_liability_data
            return LiabilityOut(**dummy_liabilities_db[i])
    return None # Liability not found

async def delete_liability_service(liability_id: str) -> bool:
    """Deletes a liability from the dummy database by ID."""
    global dummy_liabilities_db
    original_length = len(dummy_liabilities_db)
    dummy_liabilities_db = [liability for liability in dummy_liabilities_db if liability.get("id") != liability_id]
    return len(dummy_liabilities_db) < original_length 