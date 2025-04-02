def run():
    def find_missing_number(nums):
        n = len(nums) + 1
        expected_sum = n*(n+1)//2
        actual_sum = sum(nums)
        print('n: ',n, "expected_num: ",expected_sum, "actual_sum: ", actual_sum )
        return expected_sum - actual_sum

    nums = [1,2,3,4,5,6]
    print(find_missing_number(nums))