# prompt= ''' Extract Name of Student,Name of University,Name of Degree/course,Date from the given in text and return it in a json format 
#             Sample text : 
#                         Centre of Excellence in Safety Engineering and Analytics (CoE-SEA)
#                         and
#                         Continuing Education Programme (CEP)

#                         CERTIFICATE OF COMPLETION

#                         This is to certify that Mr. SANJIBAN DUTTA of Adani Group has successfully completed the short-term certificate
#                         course on ‘Logistics and Process Safety Engineering (LPSE) for the Officials of Adani Group’ during January 16, 2023 to May 12,
#                         2023, organized by the Centre of Excellence in Safety Engineering and Analytics (CoE-SEA), IIT Kharagpur


#                         https://cour sera.org/ver ify/CAB0X9LY7FD5


#             Your output should look like : {
#                                             student_name : "Mr. SANJIBAN DUTTA"
#                                             university_name : "IIT Kharagpur"
#                                             course : "Logistics and Process Safety Engineering (LPSE) for the Officials of Adani Group"
#                                             start-date : "16-01-2023"
#                                             end-date : "125-05-2023"
#                                             verfication_hash : "https://coursera.org/ver ify/CAB0X9LY7FD5"
#                                             }

#             If some info is missing in given input put the value as none in the json.
#         '''

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