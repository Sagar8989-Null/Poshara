prompt = '''
            Extract Name of Product_name,manufacturer_name,manufacture_date,expiry_date,shelf_life,batch_number from given text and return it in a json format.           
            Sample text :
                            Amul Taaza Homogenised Toned Milk  
                            Manufactured & Packed by: Gujarat Co-operative Milk Marketing Federation Ltd., Anand, India  
                            Batch No: A23M08    
                            Manufacture Date: 12/09/2025  
                            Best Before: 7 days from packaging  
                            Expiry Date: 19/09/2025
                            Net Volume: 1L

            out put should look like : {
                                            "product_name": "Amul Taaza Homogenised Toned Milk",
                                            "manufacturer_name": "Gujarat Co-operative Milk Marketing Federation Ltd.",
                                            "manufacture_date": "12-09-2025",
                                            "expiry_date": "19-09-2025",
                                            "shelf_life": "7 days from packaging",
                                            "batch_number": "A23M08"
                                        }                               
            If some info is missing in given input put the value as none in the json.
        '''