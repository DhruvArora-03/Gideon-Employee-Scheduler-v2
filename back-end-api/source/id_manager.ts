

const isValidID = (id: string) => {
    if (id != null && id.length > 0) {
        return true;
    }

    return false;
}

const isValidEID = isValidID;
const isValidMID = isValidID;
const isValidSID = isValidID;

export {
    isValidEID,
    isValidMID,
    isValidSID
}
